<div align="center">
  <h1>Elearning Courses Content Access Control</h1>
  <h4>Allow or restrict access to specific contents inside an online-course.</h4>
  <br>
  <p>
    <a href="https://github.com/JDavidMoreno/month_year_widget/blob/main/LICENSE">
        <img alt="license" src="https://img.shields.io/badge/license-MIT-green" />
    </a>
    <img alt="python version" src="https://img.shields.io/badge/python-3.5 | 3.6 | 3.7 | 3.8 | 3.9 -blue" />
    <a href="https://github.com/odoo/odoo/tree/14.0">
        <img alt="latest release" src="https://img.shields.io/badge/Odoo%20Version-14-success" />
    </a>
  </p>
</div>

<div align="center">
  <table>
    <tr>
      <td><img alt="example field just months-years" src="https://github.com/JDavidMoreno/elearning_slides_access/blob/main/.github/images/ui.png" /></td>
    </tr>
  </table>
</div>

---

## Table of Contents

- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Motivation

By default in Odoo you can restrict the access to a course as a whole, but can'd do nothing with parts of the course. With this addon, you can uses the differente sections of a courses, to decide who can access that specific section at a time.

First section of a course is always accessible, then the user must send a request to the course's responsible, and this must decide wether or not leave the student to continue the next chapter. This is specially useful when the course's responsible needs the students to follow strictly the order in which the sections of the course are set, otherwise would be so easy for a student to jump from a content to other.

## Installation

Move this module to your addons folder, and restart your Odoo server. While in developer mode, click the button Update Apps List from the Apps addons. Then just Install the module.

## Usage
From the eLearning application, start creating a new Course and add some Sections and Content to it. After saving, you can clikc the little key icon beside the section to decide who can see the content under that section.

![backend configuration](https://github.com/JDavidMoreno/elearning_slides_access/blob/main/.github/images/config.png)

Then, when one of the students will finish with the first section, a golden jumping key will appear for him/her. Clicking that key will send a request to the course's manager in the form of a Activity. The Course's resnponsible could then accept the access to the content

![backend configuration](https://github.com/JDavidMoreno/elearning_slides_access/blob/main/.github/images/request.png)

![backend configuration](https://github.com/JDavidMoreno/elearning_slides_access/blob/main/.github/images/request-2.png)

## License

This project is licensed under the terms of the
[MIT](https://choosealicense.com/licenses/mit/) license.

<div align="right">
  <b><a href="#month-year-datepicker">↥ back to top</a></b>
</div>
