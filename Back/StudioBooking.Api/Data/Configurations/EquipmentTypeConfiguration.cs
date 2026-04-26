using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudioBooking.Api.Models.Entities;

namespace StudioBooking.Api.Data.Configurations;

public class EquipmentTypeConfiguration : IEntityTypeConfiguration<EquipmentType>
{
    public void Configure(EntityTypeBuilder<EquipmentType> b)
    {
        b.ToTable("equipment_types");
        b.HasKey(x => x.TypeId);
        b.Property(x => x.TypeId).HasColumnName("type_id");
        b.Property(x => x.Name).HasColumnName("name").HasMaxLength(100).IsRequired();
        b.Property(x => x.Description).HasColumnName("description");
        b.HasIndex(x => x.Name).IsUnique();
    }
}
