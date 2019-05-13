using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace danielserrano.wm.rrs.Pages
{
    public class ReservationModel
    {
        [Required(ErrorMessage = "time is required")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "date is required")]
        public DateTime Time { get; set; }

        [StringLength(100, MinimumLength = 3, ErrorMessage = "Min Length is 2")]
        [Required]
        public string PartyName { get; set; }

        public bool Fulfilled { get; set; }
    }


    public class IndexModel : PageModel
    {
        [BindProperty]
        public ReservationModel Reservation { get; set; }

        public void OnGet()
        {

        }
    }
}
