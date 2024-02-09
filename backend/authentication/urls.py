
from django.urls import path, include
from rest_framework_simplejwt.views import TokenBlacklistView
from authentication.views import GithubLogin, GoogleLogin

urlpatterns = [
    path('', include('dj_rest_auth.urls')),
    path('registration/', include('dj_rest_auth.registration.urls')),
    path('token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path("github/", GithubLogin.as_view(), name="github_login"),
    path("google/", GoogleLogin.as_view(), name="google_login"),
]
