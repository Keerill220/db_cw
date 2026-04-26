using System.ComponentModel.DataAnnotations;

namespace StudioBooking.Api.DTOs.Studios;

public record StudioDto(
    int StudioId,
    string Name,
    string CityName,
    string Country,
    string Address,
    string? Description,
    string? PhotoUrl,
    bool IsActive,
    int AdminId,
    DateTime CreatedAt);

public record StudioDetailDto(
    int StudioId,
    string Name,
    string CityName,
    string Country,
    string Address,
    string? Description,
    string? PhotoUrl,
    bool IsActive,
    int AdminId,
    DateTime CreatedAt,
    IEnumerable<RoomSummaryDto> Rooms);

public record RoomSummaryDto(
    int RoomId,
    string Name,
    decimal AreaSqm,
    decimal PricePerHour,
    bool IsAvailable,
    string? PhotoUrl);

public record StudioCreateDto(
    [Required, MaxLength(255)] string Name,
    [Required] int CityId,
    [Required, MaxLength(255)] string Address,
    string? Description,
    string? PhotoUrl);

public record StudioUpdateDto(
    [Required, MaxLength(255)] string Name,
    [Required] int CityId,
    [Required, MaxLength(255)] string Address,
    string? Description,
    string? PhotoUrl,
    bool IsActive);
