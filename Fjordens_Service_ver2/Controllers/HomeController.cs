using Fjordens_Service_ver2.Models;
using Fjordens_Service_ver2.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fjordens_Service_ver2.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult LoadEvents(string start, string end)
        {
            var list = GetEvents();

            var rows = list.ToArray();
            return Json(rows, JsonRequestBehavior.AllowGet);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";
            //var _dummyGen = new DummyDataGen();
            //_dummyGen.generateData();
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        private List<PostItHelpModel> GetEvents()
        {
            List<PostItHelpModel> eventList = new List<PostItHelpModel>();

            PostItHelpModel postIt = new PostItHelpModel
            {
                id = 1,
                title = "First Event",
                start = DateTime.Now.AddDays(1).ToString("s"),
                end = DateTime.Now.AddDays(1).AddMinutes(55).ToString("s"),
                allDay = false,
                employee = "Mads",
                customer = "John",
                note = "This is just a test"
            };

            eventList.Add(postIt);

            return eventList;
        }
    }
}