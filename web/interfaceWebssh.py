import os
import sys


# socket：启动服务的端口,默认为8000
def runWeb(socket='8000'):
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'web.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    arg = ['manage.py', 'runserver', socket]
    #soc = input("input runserver socket please:")
    execute_from_command_line(arg)


if __name__ == '__main__':
    runWeb()
