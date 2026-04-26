using Microsoft.EntityFrameworkCore;
using StudioBooking.Api.Auth;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Seeders;

public class DataSeeder
{
    private readonly ApplicationDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ILogger<DataSeeder> _logger;
    private readonly Random _rng = new(42);

    public DataSeeder(ApplicationDbContext db, IPasswordHasher hasher, ILogger<DataSeeder> logger)
    {
        _db = db;
        _hasher = hasher;
        _logger = logger;
    }

    public async Task SeedAsync(CancellationToken ct = default)
    {
        if (await _db.Administrators.AnyAsync(ct))
        {
            _logger.LogInformation("Database already seeded, skipping.");
            return;
        }

        _logger.LogInformation("Seeding database...");

        // Pre-compute hashes once to avoid BCrypt cost ×1000
        _adminHash  = _hasher.Hash("Admin123!");
        _ownerHash  = _hasher.Hash("Owner123!");
        _clientHash = _hasher.Hash("Client123!");

        var cities = await SeedCitiesAsync(ct);
        var types  = await SeedEquipmentTypesAsync(ct);
        var admins = await SeedAdministratorsAsync(cities, ct);
        var studios = await SeedStudiosAsync(admins, cities, ct);
        var rooms  = await SeedRoomsAsync(studios, ct);
        var clients = await SeedClientsAsync(ct);
        var equip  = await SeedEquipmentAsync(rooms, types, ct);
        await SeedBookingsAsync(clients, rooms, equip, ct);

        _logger.LogInformation("=== SEED COMPLETE ===");
        _logger.LogInformation("Default credentials:");
        _logger.LogInformation("  superadmin: superadmin@local / Admin123!");
        _logger.LogInformation("  demo owner: owner@local / Owner123!");
        _logger.LogInformation("  demo client: client@local / Client123!");
    }

    private async Task<List<City>> SeedCitiesAsync(CancellationToken ct)
    {
        var names = new[]
        {
            ("Lviv", "Ukraine"), ("Kyiv", "Ukraine"), ("Kharkiv", "Ukraine"), ("Odesa", "Ukraine"),
            ("Dnipro", "Ukraine"), ("Zaporizhzhia", "Ukraine"), ("Vinnytsia", "Ukraine"),
            ("Poltava", "Ukraine"), ("Ivano-Frankivsk", "Ukraine"), ("Ternopil", "Ukraine"),
            ("Chernivtsi", "Ukraine"), ("Lutsk", "Ukraine"), ("Rivne", "Ukraine"),
            ("Zhytomyr", "Ukraine"), ("Khmelnytskyi", "Ukraine"), ("Mykolaiv", "Ukraine"),
            ("Sumy", "Ukraine"), ("Cherkasy", "Ukraine"), ("Uzhhorod", "Ukraine"),
            ("Kramatorsk", "Ukraine"), ("Mariupol", "Ukraine"), ("Kryvyi Rih", "Ukraine"),
            ("Chernihiv", "Ukraine"), ("Bila Tserkva", "Ukraine"), ("Melitopol", "Ukraine"),
            ("Warsaw", "Poland"), ("Berlin", "Germany"), ("Prague", "Czech Republic"),
            ("Vienna", "Austria"), ("Krakow", "Poland"),
        };
        var cities = names.Select(n => new City { Name = n.Item1, Country = n.Item2 }).ToList();
        _db.Cities.AddRange(cities);
        await _db.SaveChangesAsync(ct);
        return cities;
    }

    private async Task<List<EquipmentType>> SeedEquipmentTypesAsync(CancellationToken ct)
    {
        var types = new[]
        {
            new EquipmentType { Name = "Drums", Description = "Drum kits and percussion" },
            new EquipmentType { Name = "Guitar Amp", Description = "Electric guitar amplifiers" },
            new EquipmentType { Name = "Bass Amp", Description = "Bass guitar amplifiers" },
            new EquipmentType { Name = "Microphone", Description = "Vocal and instrument mics" },
            new EquipmentType { Name = "Keyboard", Description = "Synthesizers and digital pianos" },
            new EquipmentType { Name = "Mixer", Description = "Audio mixing consoles" },
            new EquipmentType { Name = "Monitor", Description = "Stage monitor speakers" },
            new EquipmentType { Name = "DI Box", Description = "Direct injection boxes" },
            new EquipmentType { Name = "Effects Pedal", Description = "Guitar/bass effects units" },
            new EquipmentType { Name = "PA System", Description = "Public address speaker systems" },
        }.ToList();
        _db.EquipmentTypes.AddRange(types);
        await _db.SaveChangesAsync(ct);
        return types;
    }

    private string _adminHash = string.Empty;
    private string _ownerHash = string.Empty;
    private string _clientHash = string.Empty;

    private async Task<List<Administrator>> SeedAdministratorsAsync(List<City> cities, CancellationToken ct)
    {
        var admins = new List<Administrator>
        {
            new() { Email = "superadmin@local", PasswordHash = _adminHash,
                FirstName = "Super", LastName = "Admin", Role = AdminRole.Superadmin,
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            new() { Email = "owner@local", PasswordHash = _ownerHash,
                FirstName = "Demo", LastName = "Owner", Phone = "+380501234567",
                Role = AdminRole.Owner, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
        };

        var firstNames = new[] { "Oleksiy", "Ivan", "Mykola", "Andriy", "Vasyl", "Dmytro", "Taras", "Bohdan", "Serhiy", "Yuriy" };
        var lastNames  = new[] { "Kovalenko", "Melnyk", "Shevchenko", "Bondarenko", "Kravchenko", "Morozov", "Petrenko", "Hrytsenko", "Savchenko", "Tkachenko" };

        for (int i = 1; i <= 48; i++)
        {
            admins.Add(new Administrator
            {
                Email = $"owner{i}@studiobooking.com",
                PasswordHash = _ownerHash,
                FirstName = firstNames[i % firstNames.Length],
                LastName = lastNames[i % lastNames.Length],
                Phone = $"+38050{i:D7}",
                Role = AdminRole.Owner,
                CreatedAt = DateTime.UtcNow.AddDays(-_rng.Next(30, 365)),
                UpdatedAt = DateTime.UtcNow,
            });
        }

        _db.Administrators.AddRange(admins);
        await _db.SaveChangesAsync(ct);
        return admins;
    }

    private async Task<List<Studio>> SeedStudiosAsync(List<Administrator> admins, List<City> cities, CancellationToken ct)
    {
        var owners = admins.Where(a => a.Role == AdminRole.Owner).ToList();
        var studioNames = new[] { "Sound Wave", "Beat Factory", "Rhythm House", "Groove Station", "The Rehearsal Room",
            "Rock Box", "Bass Cave", "Steel String", "Blue Note", "Sonic Lab", "Fusion Studio", "Resonance Hall" };
        var studios = new List<Studio>();

        for (int i = 0; i < 200; i++)
        {
            var owner = owners[i % owners.Count];
            var city = cities[i % cities.Count];
            studios.Add(new Studio
            {
                AdminId = owner.AdminId,
                CityId = city.CityId,
                Name = $"{studioNames[i % studioNames.Length]} {i + 1}",
                Address = $"вул. {GetStreet(i)}, {_rng.Next(1, 200)}",
                Description = "Повністю обладнана студія з якісною звукоізоляцією та сучасним обладнанням.",
                IsActive = i % 10 != 0,
                CreatedAt = DateTime.UtcNow.AddDays(-_rng.Next(60, 730)),
                UpdatedAt = DateTime.UtcNow,
            });
        }

        _db.Studios.AddRange(studios);
        await _db.SaveChangesAsync(ct);
        return studios;
    }

    private async Task<List<Room>> SeedRoomsAsync(List<Studio> studios, CancellationToken ct)
    {
        var rooms = new List<Room>();
        var roomNames = new[] { "Room A", "Room B", "Room C", "Big Hall", "Small Hall", "Jam Room", "Recording Suite", "Live Room" };
        int idx = 0;

        foreach (var studio in studios)
        {
            int count = _rng.Next(4, 8);
            for (int i = 0; i < count && idx < 1200; i++, idx++)
            {
                rooms.Add(new Room
                {
                    StudioId = studio.StudioId,
                    Name = roomNames[i % roomNames.Length],
                    AreaSqm = Math.Round((decimal)(_rng.Next(15, 120) + _rng.NextDouble()), 2),
                    PricePerHour = _rng.Next(200, 2000),
                    IsAvailable = _rng.Next(10) > 1,
                    Description = "Простора репетиційна кімната з PA-системою та моніторами.",
                });
            }
        }

        _db.Rooms.AddRange(rooms);
        await _db.SaveChangesAsync(ct);
        return rooms;
    }

    private async Task<List<Client>> SeedClientsAsync(CancellationToken ct)
    {
        var clients = new List<Client>
        {
            new() { Email = "client@local", PasswordHash = _clientHash,
                FirstName = "Demo", LastName = "Client", Phone = "+380661234567",
                CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
        };

        var firstNames = new[] { "Olha", "Oksana", "Natalia", "Iryna", "Yulia", "Anna", "Halyna", "Larysa",
            "Mykola", "Andriy", "Ivan", "Vasyl", "Taras", "Serhiy", "Dmytro", "Roman", "Bohdan", "Pavlo" };
        var lastNames  = new[] { "Kovalenko", "Melnyk", "Shevchenko", "Bondarenko", "Kravchenko",
            "Petrenko", "Tkachenko", "Hrytsenko", "Savchenko", "Morozenko", "Lysenko", "Marchenko" };

        for (int i = 1; i <= 1000; i++)
        {
            clients.Add(new Client
            {
                Email = $"client{i}@example.com",
                PasswordHash = _clientHash,
                FirstName = firstNames[i % firstNames.Length],
                LastName = lastNames[i % lastNames.Length],
                Phone = $"+38067{i:D7}",
                CreatedAt = DateTime.UtcNow.AddDays(-_rng.Next(1, 500)),
                UpdatedAt = DateTime.UtcNow,
            });
        }

        _db.Clients.AddRange(clients);
        await _db.SaveChangesAsync(ct);
        return clients;
    }

    private async Task<List<Equipment>> SeedEquipmentAsync(List<Room> rooms, List<EquipmentType> types, CancellationToken ct)
    {
        var equipment = new List<Equipment>();
        var conditions = new[] { "Excellent", "Good", "Fair" };
        int idx = 0;

        foreach (var room in rooms)
        {
            int count = _rng.Next(2, 6);
            for (int i = 0; i < count && idx < 1500; i++, idx++)
            {
                var type = types[_rng.Next(types.Count)];
                equipment.Add(new Equipment
                {
                    RoomId = room.RoomId,
                    TypeId = type.TypeId,
                    Name = $"{type.Name} #{_rng.Next(1, 100)}",
                    Condition = conditions[_rng.Next(conditions.Length)],
                    PricePerHour = Math.Round((decimal)(_rng.Next(20, 300) + _rng.NextDouble()), 2),
                });
            }
        }

        _db.Equipments.AddRange(equipment);
        await _db.SaveChangesAsync(ct);
        return equipment;
    }

    private async Task SeedBookingsAsync(List<Client> clients, List<Room> rooms, List<Equipment> equipment, CancellationToken ct)
    {
        var bookings = new List<Booking>();
        var statuses = new[] { BookingStatus.Pending, BookingStatus.Confirmed, BookingStatus.Completed, BookingStatus.Cancelled };
        var baseDate = DateTime.UtcNow;

        // Track occupied slots to avoid overlap conflicts during seed
        var occupiedSlots = new Dictionary<(int RoomId, DateOnly Date), List<(TimeOnly Start, TimeOnly End)>>();

        int count = 0;
        int attempts = 0;

        while (count < 1100 && attempts < 5000)
        {
            attempts++;
            var room = rooms[_rng.Next(rooms.Count)];
            var daysOffset = _rng.Next(-200, 30);
            var date = DateOnly.FromDateTime(baseDate.AddDays(daysOffset));
            var startHour = _rng.Next(8, 21);
            var duration = _rng.Next(1, 4);
            var endHour = startHour + duration;
            if (endHour > 23) continue;

            var start = new TimeOnly(startHour, 0);
            var end = new TimeOnly(endHour, 0);

            var key = (room.RoomId, date);
            if (!occupiedSlots.ContainsKey(key)) occupiedSlots[key] = [];

            // Check for overlap in seed data
            if (occupiedSlots[key].Any(s => s.Start < end && s.End > start)) continue;

            var status = daysOffset < -7
                ? (daysOffset < -30 ? BookingStatus.Completed : BookingStatus.Confirmed)
                : statuses[_rng.Next(statuses.Length)];

            var client = clients[_rng.Next(clients.Count)];

            // Rough total price calculation for seed (triggers recalc on INSERT)
            var durationHrs = (decimal)duration;
            var totalPrice = Math.Round(room.PricePerHour * durationHrs, 2);

            bookings.Add(new Booking
            {
                ClientId = client.ClientId,
                RoomId = room.RoomId,
                Date = date,
                StartTime = start,
                EndTime = end,
                TotalPrice = totalPrice,
                Status = status,
                CreatedAt = baseDate.AddDays(daysOffset - 2),
            });

            occupiedSlots[key].Add((start, end));
            count++;
        }

        _db.Bookings.AddRange(bookings);
        await _db.SaveChangesAsync(ct);
        _logger.LogInformation("Seeded {Count} bookings.", bookings.Count);
    }

    private static string GetStreet(int i)
    {
        var streets = new[] { "Шевченка", "Франка", "Лесі Українки", "Грушевського", "Незалежності",
            "Соборна", "Хрещатик", "Велика Васильківська", "Саксаганського", "Антоновича" };
        return streets[i % streets.Length];
    }
}
