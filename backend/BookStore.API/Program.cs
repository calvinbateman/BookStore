using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// register the SQLite database connection
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite("Data Source=data/Bookstore.sqlite"));

// allow specific origins to call the API
builder.Services.AddCors(options =>
    options.AddPolicy("AllowFrontend", policy =>
        policy.WithOrigins(
            "http://localhost:5173",   // local Vite dev server
            "https://localhost:5173",
            "https://green-bay-0fe3fb310.6.azurestaticapps.net"  // Azure Static Web Apps
        )
        .AllowAnyMethod()
        .AllowAnyHeader()));

var app = builder.Build();

if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseCors("AllowFrontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
