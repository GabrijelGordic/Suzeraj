"""
WSGI config for config project.
It exposes the WSGI callable as a module-level variable named ``application``.
"""

from django.core.wsgi import get_wsgi_application
import os
import socket  # <--- Import socket

# --- START FIX: FORCE IPv4 ---
# This forces Django/Gunicorn to use IPv4, bypassing the
# "[Errno 101] Network is unreachable" error with Gmail on Render.


def force_ipv4():
    old_getaddrinfo = socket.getaddrinfo

    def new_getaddrinfo(*args, **kwargs):
        responses = old_getaddrinfo(*args, **kwargs)
        # Filter out IPv6 (AF_INET6) and keep only IPv4 (AF_INET)
        return [r for r in responses if r[0] == socket.AF_INET]
    socket.getaddrinfo = new_getaddrinfo


force_ipv4()
# --- END FIX ---


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
