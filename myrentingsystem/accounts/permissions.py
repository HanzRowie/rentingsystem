from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
    
class IsSeeker(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'seeker'
    
class IsRoomOwner(BasePermission):
    def has_permission(self, request, view):
        print(f"Permission check - User: {request.user}, Authenticated: {request.user.is_authenticated}, Role: {getattr(request.user, 'role', 'No role')}")  # Debug log
        return request.user.is_authenticated and request.user.role == 'room owner'  

