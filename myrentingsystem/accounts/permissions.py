from  rest_framework import BasePermission

class IsAdmin(BasePermission):
    def  has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role == 'admin'
    
class IsSeeker(BasePermission):
    def has_permission(self,request,view):
        return request.user.is_authenticated and request.user.role =='seeker'
    
