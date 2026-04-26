namespace StudioBooking.Api.Auth;

public interface ICurrentUser
{
    int UserId { get; }
    string Role { get; }
    string AccountType { get; }
    bool IsAdmin { get; }
    bool IsClient { get; }
}
