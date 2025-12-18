from django.db import models
from django.contrib.auth.models import User


class Shoe(models.Model):
    CONDITION_CHOICES = (
        ('New', 'New'),
        ('Used', 'Used'),
    )

    # NEW CURRENCY CHOICES
    CURRENCY_CHOICES = (
        ('EUR', '€'),
        ('USD', '$'),
        ('GBP', '£'),
    )
    views = models.PositiveIntegerField(default=0)
    seller = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='shoes')
    title = models.CharField(max_length=100)
    brand = models.CharField(max_length=50)
    size = models.DecimalField(max_digits=4, decimal_places=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(
        max_length=3, choices=CURRENCY_CHOICES, default='EUR')
    condition = models.CharField(
        max_length=10, choices=CONDITION_CHOICES, default='New')
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='shoe_images/')

    # --- THIS WAS LIKELY MISSING ---
    contact_info = models.CharField(max_length=100, blank=True)
    # -------------------------------

    is_sold = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.brand})"


class ShoeImage(models.Model):
    shoe = models.ForeignKey(
        Shoe, on_delete=models.CASCADE, related_name='gallery')
    image = models.ImageField(upload_to='shoe_gallery/')

    def __str__(self):
        return f"Image for {self.shoe.title}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    shoe = models.ForeignKey(Shoe, on_delete=models.CASCADE, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'shoe') # User can't like the same shoe twice