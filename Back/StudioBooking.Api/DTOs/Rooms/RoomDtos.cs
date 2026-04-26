using System.ComponentModel.DataAnnotations;

namespace StudioBooking.Api.DTOs.Rooms;

public record RoomDto(
    int RoomId,
    int StudioId,
    string StudioName,
    string Name,
    decimal AreaSqm,
    decimal PricePerHour,
    bool IsAvailable,
    string? Description,
    string? PhotoUrl);

public record RoomDetailDto(
    int RoomId,
    int StudioId,
    string StudioName,
    string Name,
    decimal AreaSqm,
    decimal PricePerHour,
    bool IsAvailable,
    string? Description,
    string? PhotoUrl,
    IEnumerable<EquipmentSummaryDto> Equipments,
    IEnumerable<BusySlotDto> BusySlots);

public record EquipmentSummaryDto(
    int EquipmentId,
    string Name,
    string TypeName,
    string? Condition,
    decimal PricePerHour);

public record BusySlotDto(TimeOnly StartTime, TimeOnly EndTime);

public record RoomCreateDto(
    [Required] int StudioId,
    [Required, MaxLength(255)] string Name,
    [Range(1, 10000)] decimal AreaSqm,
    [Range(0, 100000)] decimal PricePerHour,
    string? Description,
    string? PhotoUrl);

public record RoomUpdateDto(
    [Required, MaxLength(255)] string Name,
    [Range(1, 10000)] decimal AreaSqm,
    [Range(0, 100000)] decimal PricePerHour,
    bool IsAvailable,
    string? Description,
    string? PhotoUrl);
