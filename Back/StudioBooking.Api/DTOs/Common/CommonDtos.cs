using System.ComponentModel.DataAnnotations;

namespace StudioBooking.Api.DTOs.Common;

public record CityDto(int CityId, string Name, string Country);
public record EquipmentTypeDto(int TypeId, string Name, string? Description);

public record AdminUserDto(
    int AdminId,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string Role,
    DateTime CreatedAt);

public record AdminCreateDto(
    [Required, EmailAddress] string Email,
    [Required, MinLength(6)] string Password,
    [Required] string FirstName,
    [Required] string LastName,
    string? Phone,
    [Required] string Role);

public record ProfileUpdateDto(
    [Required] string FirstName,
    [Required] string LastName,
    string? Phone);

public record ChangePasswordDto(
    [Required] string CurrentPassword,
    [Required, MinLength(6)] string NewPassword);

public record OccupancyReportItemDto(
    int StudioId,
    string StudioName,
    int Month,
    int Year,
    int TotalBookings,
    decimal OccupiedHours);

public record RevenueReportItemDto(
    int StudioId,
    string StudioName,
    int Month,
    int Year,
    decimal Revenue);

public record TopRoomDto(
    int RoomId,
    string RoomName,
    string StudioName,
    int TotalBookings,
    decimal TotalRevenue);
