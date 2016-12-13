using System.ComponentModel.DataAnnotations;

namespace Fjordens_Service_ver2.Models
{
    public class PostItHelpModel
    {
        public int id { get; set; }

        public string title { get; set; }
        [Required]
        public string start { get; set; }
        [Required]
        public string end { get; set; }

        public int dayOfWeek { get; set; }

        public bool allDay { get; set; }

        public string employeeName { get; set; }

        public string customerName { get; set; }
        [Required]
        public int employeeId { get; set; }
        [Required]
        public int customerId { get; set; }

        public string note { get; set; }

        public int templateNo { get; set; }

        public int? templateId { get; set; }

        public bool isAssigned { get; set; }
    }
}