using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Data;
using StudioBooking.Api.DTOs.Common;

namespace StudioBooking.Api.Controllers;

[ApiController]
[Route("api/cities")]
public class CitiesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public CitiesController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IEnumerable<CityDto>> GetAll(CancellationToken ct) =>
        await _db.Cities.OrderBy(c => c.Name)
            .Select(c => new CityDto(c.CityId, c.Name, c.Country))
            .ToListAsync(ct);
}

[ApiController]
[Route("api/equipment-types")]
public class EquipmentTypesController : ControllerBase
{
    private readonly ApplicationDbContext _db;
    public EquipmentTypesController(ApplicationDbContext db) => _db = db;

    [HttpGet]
    public async Task<IEnumerable<EquipmentTypeDto>> GetAll(CancellationToken ct) =>
        await _db.EquipmentTypes.OrderBy(t => t.Name)
            .Select(t => new EquipmentTypeDto(t.TypeId, t.Name, t.Description))
            .ToListAsync(ct);
}
