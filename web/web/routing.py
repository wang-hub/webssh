#routing.py类似于Django中的url.py指明websocket协议的路由
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django_webssh import routing

# URLRouter： 指定路由文件的路径，也可以直接将路由信息写在这里，
# 代码中配置了路由文件的路径，会去django_webssh下的routeing.py文件中查找websocket_urlpatterns

application = ProtocolTypeRouter(
    {
        'websocket':AuthMiddlewareStack(
            URLRouter(
                routing.websocket_urlpatterns
            )
        ),
    }
)

# from channels.routing import route
# channel_routing = [
#     route("http.request", "django_webssh.consumers.SSHConsumer"),
# ]
