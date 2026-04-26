using System.ComponentModel.DataAnnotations;

namespace StudioBooking.Api.DTOs.Equipment;

public record EquipmentDto(
    int EquipmentId,
    int RoomId,
    string RoomName,
    int TypeId,
    string TypeName,
    string Name,
    string? Condition,
    decimal PricePerHour);

public record EquipmentCreateDto(
    [Required] int RoomId,
    [Required] int TypeId,
    [Required, MaxLength(255)] string Name,
    [MaxLength(50)] string? Condition,
    [Range(0, 100000)] decimal PricePerHour);

public record EquipmentUpdateDto(
    [Required] int TypeId,
    [Required, MaxLength(255)] string Name,
    [MaxLength(50)] string? Condition,
    [Range(0, 100000)] decimal PricePerHour);
