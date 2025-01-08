import React from "react";
import Link from "next/link";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      subMenu: [{ name: "Overview", link: "/admin" }],
    },
    {
      name: "Customer Management",
      subMenu: [{ name: "Customers", link: "/admin/customer_management" }],
    },
    {
      name: "Service Provider Management",
      subMenu: [
        { name: "Service Providers", link: "/service-providers" },
        {
          name: "Inquiry Applications",
          link: "/admin/inquiry",
        },
        {
          name: "Accepted Returned Applications",
          link: "/accepted-returned-applications",
        },
      ],
    },
    {
      name: "Bookings Management",
      subMenu: [
        { name: "Pending Bookings", link: "/pending-bookings" },
        { name: "Escalated Bookings", link: "/escalated-bookings" },
        { name: "Cancelled Bookings", link: "/cancelled-bookings" },
      ],
    },
    {
      name: "Payments Management",
      subMenu: [
        { name: "Transactions History", link: "/transactions-history" },
        { name: "Pending Payouts", link: "/pending-payouts" },
      ],
    },
    {
      name: "Ticket Management",
      subMenu: [{ name: "Tickets", link: "/tickets" }],
    },
    {
      name: "Services Management",
      subMenu: [
        { name: "Services List", link: "admin/services" },
        { name: "Add Service", link: "/add-service" },
      ],
    },
    {
      name: "Notifications Management",
      subMenu: [
        { name: "Notifications History", link: "/notifications-history" },
        { name: "Craft Notification", link: "/craft-notification" },
      ],
    },
    {
      name: "Global Settings",
      subMenu: [
        {
          name: "Service Time Gap Settings",
          link: "/service-time-gap-settings",
        },
      ],
    },
    {
      name: "Logs",
      subMenu: [
        { name: "Administrator Logs", link: "/administrator-logs" },
        { name: "Service Provider Logs", link: "/service-provider-logs" },
      ],
    },
  ];

  return (
    <aside className="h-screen p-2 w-1/5">
      <h1 className="text-3xl ml-2 font-bold mb-10">[App Name]</h1>
      <nav>
        {menuItems.map((item, idx) => (
          <div key={idx} className="mb-4">
            <h2
              className="bg-background p-2 rounded-lg font-bold text-primary"
              style={{ fontSize: "14px", backgroundColor: "#f6f7f9" }}
            >
              {item.name}
            </h2>
            <ul className="pl-4 mt-2">
              {item.subMenu.map((subItem, subIdx) => (
                <li
                  key={subIdx}
                  className="text-gray-500 hover:text-purple-600 mb-2 flex justify-between items-center"
                  style={{ fontSize: "14px" }}
                >
                  <Link href={subItem.link}>{subItem.name}</Link>
                  <span className="mr-3">&gt;</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
