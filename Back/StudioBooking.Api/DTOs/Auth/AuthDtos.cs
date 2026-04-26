using System.ComponentModel.DataAnnotations;

namespace StudioBooking.Api.DTOs.Auth;

public record LoginRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password);

public record RegisterRequest(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    [Required, MaxLength(100)] string FirstName,
    [Required, MaxLength(100)] string LastName,
    [MaxLength(20)] string? Phone);

public record AuthResponse(
    string Token,
    string Role,
    int UserId,
    string AccountType,
    DateTime ExpiresAt);

public record MeResponse(
    int UserId,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string Role,
    string AccountType);
