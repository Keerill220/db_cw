using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class CityConfiguration : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> b)
    {
        b.ToTable("cities");
        b.HasKey(x => x.CityId);
        b.Property(x => x.CityId).HasColumnName("city_id");
        b.Property(x => x.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        b.Property(x => x.Country).HasColumnName("country").HasMaxLength(100).IsRequired();
        b.HasIndex(x => x.Name).IsUnique();
    }
}
