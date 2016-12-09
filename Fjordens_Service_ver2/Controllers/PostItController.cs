using Fjordens_Service_ver2.DAL.Contracts;
using Fjordens_Service_ver2.DAL.Repositories;
using Fjordens_Service_ver2.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Fjordens_Service_ver2.Controllers
{
    public class PostItController : Controller
    {
        public JsonResult GetPostIts(string start, string end, int id, int employeeId)
        {
            IQueryable<PostIt> postIts = null;
            List<PostItHelpModel> postItHelpModels = new List<PostItHelpModel>();
            using (IPostItRepository _postItRepository = new PostItRepository(ApplicationDbContext.Create()))
            using (ICustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
            using (IEmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                if(employeeId > -1)
                {
                    postIts = _postItRepository.AllForEmployee(employeeId, id);
                }
                else
                {
                    postIts = _postItRepository.AllForTemplate(id);

                }

                foreach (var postIt in postIts)
                {
                    var customer = _customerRepository.Find(postIt.CustomerId);
                    var employee = _employeeRepository.Find(postIt.EmployeeId);

                    var postItHelpModel = new PostItHelpModel()
                    {
                        id = postIt.EventId,
                        title = postIt.Title,
                        start = postIt.From,
                        end = postIt.To,
                        note = postIt.Note,
                        customerId = postIt.CustomerId,
                        employeeId = postIt.EmployeeId,
                        customerName = customer.Company,
                        employeeName = employee.Name,
                        allDay = false,
                        templateNo = postIt.TemplateNo,
                        templateId = postIt.TemplateId
                    };
                    postItHelpModels.Add(postItHelpModel);
                }
            }
            var rows = postItHelpModels.ToArray();
            return Json(rows, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetTemplate(string start, string end, int id, int employeeId)
        {
            IQueryable<PostIt> postIts = null;
            List<PostItHelpModel> postItsList = new List<PostItHelpModel>();
            using (IPostItRepository _postItRepository = new PostItRepository(ApplicationDbContext.Create()))
            using (ICustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
            using (IEmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                if (employeeId > -1)
                {
                    postIts = _postItRepository.AllForEmployee(employeeId, id);
                }
                else
                {
                    postIts = _postItRepository.AllForTemplate(id);
                }

                foreach (var postIt in postIts)
                {
                    var customer = _customerRepository.Find(postIt.CustomerId);
                    var employee = _employeeRepository.Find(postIt.EmployeeId);

                    var from = Convert.ToDateTime(start);
                    var fromAddDays = from.AddDays(postIt.DayOfWeek);
                    var to = Convert.ToDateTime(start);
                    var toAddDays = to.AddDays(postIt.DayOfWeek);
                    var fromToDate = DateTime.Parse(postIt.From);
                    var toToDate = DateTime.Parse(postIt.To);
                    var finalStart = fromAddDays.Add(TimeSpan.Parse(fromToDate.ToString("HH:mm")));
                    var finalEnd = toAddDays.Add(TimeSpan.Parse(toToDate.ToString("HH:mm")));

                    PostItHelpModel newPostIt = new PostItHelpModel()
                    {
                        id = postIt.EventId,
                        title = postIt.Title,
                        start = finalStart.ToString("s"),
                        end = finalEnd.ToString("s"),
                        note = postIt.Note,
                        customerId = postIt.CustomerId,
                        employeeId = postIt.EmployeeId,
                        customerName = customer.Company,
                        employeeName = employee.Name,
                        templateNo = id,
                        templateId = null,
                        allDay = false,
                        dayOfWeek = postIt.DayOfWeek
                    };
                    postItsList.Add(newPostIt);
                }
            }
            var rows = postItsList.ToArray();
            return Json(rows, JsonRequestBehavior.AllowGet);
        }

        public JsonResult CreateTemplate(TemplateData templateData)
        {
            IQueryable<PostIt> postIts = null;
            List<PostIt> postItsList = new List<PostIt>();
            using (IPostItRepository _postItRepository = new PostItRepository(ApplicationDbContext.Create()))
            using (ICustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
            using (IEmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
            {
                postIts = _postItRepository.AllForTemplate(templateData.templateId);

                foreach (var postIt in postIts)
                {
                    var from = Convert.ToDateTime(templateData.start);
                    var fromAddDays = from.AddDays(postIt.DayOfWeek);
                    var to = Convert.ToDateTime(templateData.start);
                    var toAddDays = to.AddDays(postIt.DayOfWeek);
                    var fromToDate = DateTime.Parse(postIt.From);
                    var toToDate = DateTime.Parse(postIt.To);
                    var finalStart = fromAddDays.Add(TimeSpan.Parse(fromToDate.ToString("HH:mm")));
                    var finalEnd = toAddDays.Add(TimeSpan.Parse(toToDate.ToString("HH:mm")));

                    PostIt newPostIt = new PostIt()
                    {
                        Title = postIt.Title,
                        From = finalStart.ToString("s"),
                        To = finalEnd.ToString("s"),
                        Note = postIt.Note,
                        CustomerId = postIt.CustomerId,
                        EmployeeId = postIt.EmployeeId,
                        TemplateNo = 0,
                        TemplateId = postIt.EventId,
                        CreatedDate = DateTime.Now,
                        DayOfWeek = postIt.DayOfWeek
                    };
                    postItsList.Add(newPostIt);
                }
                foreach(var postIt in postItsList)
                {
                    _postItRepository.Insert(postIt);
                    _postItRepository.Save();
                }
            }
            return Json(true);
        }

        public JsonResult DelPostIt(int id)
        {
            using (IPostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
            {
                _postItRepo.Delete(id);
                _postItRepo.Save();
                return Json(true, JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult UpdatePostIt(PostItHelpModel postItHelpModel)
        {
            if (ModelState.IsValid)
            {
                using (PostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
                using (CustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
                using (EmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
                {
                    PostIt postIt = _postItRepo.Find(postItHelpModel.id);
                    postIt.Title = postItHelpModel.title;
                    postIt.From = postItHelpModel.start;
                    postIt.To = postItHelpModel.end;
                    postIt.CustomerId = postItHelpModel.customerId;
                    postIt.EmployeeId = postItHelpModel.employeeId;
                    postIt.DayOfWeek = postItHelpModel.dayOfWeek;
                    postIt.Note = postItHelpModel.note;
                    postIt.TemplateNo = postItHelpModel.templateNo;
                    _postItRepo.Update(postIt);
                    _postItRepo.Save();
                    return Json(true);
                }
            }
            return Json(false);
           
        }

        public JsonResult CreatePostIt(PostItHelpModel postItHelpModel)
        {
            if (ModelState.IsValid)
            {
                TimeZone localTime = TimeZone.CurrentTimeZone;
                Console.WriteLine(localTime.StandardName);
                using (PostItRepository _postItRepo = new PostItRepository(ApplicationDbContext.Create()))
                using (CustomerRepository _customerRepository = new CustomerRepository(ApplicationDbContext.Create()))
                using (EmployeeRepository _employeeRepository = new EmployeeRepository(ApplicationDbContext.Create()))
                {
                    PostIt postIt = new PostIt()
                    {
                        Title = postItHelpModel.title,
                        From = postItHelpModel.start,
                        To = postItHelpModel.end,
                        Note = postItHelpModel.note,
                        DayOfWeek = postItHelpModel.dayOfWeek,
                        TemplateNo = postItHelpModel.templateNo,
                        CreatedDate = DateTime.Now,
                        CustomerId = postItHelpModel.customerId,
                        EmployeeId = postItHelpModel.employeeId

                    };
                    _postItRepo.Insert(postIt);
                    _postItRepo.Save();
                    return Json(true);
                }
            }
            return Json(false);
        }
    }
}