using System.Diagnostics;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AspNetCore.RouteAnalyzer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Services;
using WebApp.Hubs;
using Microsoft.Extensions.Hosting;
using Services.Models;

namespace WebApp {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            services.Configure<CookiePolicyOptions>(options => {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            services.AddMvc(options => options.EnableEndpointRouting = false);

            services.AddCors(options => options.AddPolicy("CorsPolicy",
                builder => {
                    builder.AllowAnyMethod().AllowAnyHeader()
                        .WithOrigins("http://localhost:3000")
                        .AllowCredentials();
                }));

            services.AddSignalR();


            // services.AddSingleton<IStockTickerServiceOld, RandomStockTicker>();

            // services.AddSingleton<IDataSource>(new VNDStockDataFile("raw_data.txt"));

            services.AddSingleton<IDataSource>(new VNDStockDataSocket());
            
            services.AddSingleton<IStockTickerService, StockTickerService>();

            services.AddSingleton<IStockHistoryService>(new StockHistoryService(new StockTickerContext(), DateTime.Now.Subtract(TimeSpan.FromDays(400))));

            services.AddSingleton<IStockPriceService, StockPriceService>();
            
            services.AddScoped<IStockAlertService, StockAlertService>();

            services.AddRouteAnalyzer();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env) {
            if (env.IsDevelopment()) {
                app.UseDeveloperExceptionPage();
            } else {
                app.UseExceptionHandler("/Error");
            }

            app.UseStaticFiles();
            app.UseCookiePolicy();

            app.UseCors("CorsPolicy");
            app.UseMvc(routes => {
                // routes.MapRoute ("test'", "/test", defaults: new {controller = "StockTable", action="AllStocks"});
                routes.MapRouteAnalyzer("/routes"); // Add
            });
            app.UseStaticFiles();
            app.UseCookiePolicy();

            // app.UseSignalR(routes => {
            //     routes.MapHub<StockTickerHub>("/stock-ticker");
            //     // routes.MapHub<StockTickerHubOld>("/stock-ticker");
            // });
            app.UseRouting();
            app.UseEndpoints(endpoints => {
                endpoints.MapHub<StockTickerHub>("/stock-ticker");
            });
        }
    }
}