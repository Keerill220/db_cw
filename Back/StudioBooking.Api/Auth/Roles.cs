namespace StudioBooking.Api.Auth;

public static class Roles
{
    public const string Superadmin = "Superadmin";
    public const string Owner = "Owner";
    public const string Client = "Client";
}

public static class ClaimNames
{
    public const string AccountType = "account_type";
    public const string UserId = "user_id";
}
