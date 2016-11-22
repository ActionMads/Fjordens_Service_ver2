using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Fjordens_Service_ver2.Startup))]
namespace Fjordens_Service_ver2
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
