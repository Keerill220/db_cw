using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudioBooking.Api.DTOs.Auth;
using StudioBooking.Api.DTOs.Common;
using StudioBooking.Api.Services;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    public AuthController(IAuthService auth) => _auth = auth;

    [HttpPost("login/client")]
    public Task<AuthResponse> LoginClient([FromBody] LoginRequest dto, CancellationToken ct) =>
        _auth.LoginClientAsync(dto, ct);

    [HttpPost("login/admin")]
    public Task<AuthResponse> LoginAdmin([FromBody] LoginRequest dto, CancellationToken ct) =>
        _auth.LoginAdminAsync(dto, ct);

    [HttpPost("register")]
    public Task<RegisterInitiatedResponse> Register([FromBody] RegisterRequest dto, CancellationToken ct) =>
        _auth.InitiateRegistrationAsync(dto, ct);

    [HttpPost("verify-email")]
    public Task<AuthResponse> VerifyEmail([FromBody] VerifyEmailRequest dto, CancellationToken ct) =>
        _auth.VerifyEmailAsync(dto, ct);

    [HttpPost("resend-verification")]
    public Task ResendVerification([FromBody] ResendVerificationRequest dto, CancellationToken ct) =>
        _auth.ResendVerificationAsync(dto, ct);

    [Authorize]
    [HttpGet("me")]
    public Task<MeResponse> Me(CancellationToken ct) => _auth.GetMeAsync(ct);

    [Authorize]
    [HttpPut("profile")]
    public Task<ProfileUpdateDto> UpdateProfile([FromBody] ProfileUpdateDto dto, CancellationToken ct) =>
        _auth.UpdateProfileAsync(dto, ct);

    [Authorize]
    [HttpPost("change-password")]
    public Task ChangePassword([FromBody] ChangePasswordDto dto, CancellationToken ct) =>
        _auth.ChangePasswordAsync(dto, ct);
}
