using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudioBooking.Api.Migrations
{
    /// <inheritdoc />
    public partial class ApplySqlScripts : Migration
    {
        private static string SqlFile(string name)
        {
            var dir = Path.Combine(AppContext.BaseDirectory, "Data", "Sql");
            return File.ReadAllText(Path.Combine(dir, name));
        }

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(SqlFile("001_indexes.sql"));
            migrationBuilder.Sql(SqlFile("002_trigger_no_overlap.sql"));
            migrationBuilder.Sql(SqlFile("003_trigger_calc_total_price.sql"));
            migrationBuilder.Sql(SqlFile("004_trigger_equipment_price_snapshot.sql"));
            migrationBuilder.Sql(SqlFile("005_trigger_updated_at.sql"));
            migrationBuilder.Sql(SqlFile("006_proc_occupancy_report.sql"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_booking_no_overlap ON bookings;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_booking_calc_total_price ON bookings;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_be_price_snapshot ON booking_equipment;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_studio_updated_at ON studios;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_admin_updated_at ON administrators;");
            migrationBuilder.Sql("DROP TRIGGER IF EXISTS trg_client_updated_at ON clients;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_booking_no_overlap;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_booking_calc_total_price;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_be_price_snapshot;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS fn_set_updated_at;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS sp_studio_occupancy_report;");
        }
    }
}

