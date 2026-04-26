using System.Security.Claims;

namespace StudioBooking.Api.Auth;

public class CurrentUser : ICurrentUser
{
    public int UserId { get; }
    public string Role { get; }
    public string AccountType { get; }
    public bool IsAdmin => AccountType == "admin";
    public bool IsClient => AccountType == "client";

    public CurrentUser(IHttpContextAccessor httpContextAccessor)
    {
        var user = httpContextAccessor.HttpContext?.User;
        UserId = int.TryParse(user?.FindFirstValue(ClaimNames.UserId), out var id) ? id : 0;
        Role = user?.FindFirstValue(ClaimTypes.Role) ?? string.Empty;
        AccountType = user?.FindFirstValue(ClaimNames.AccountType) ?? string.Empty;
    }
}
