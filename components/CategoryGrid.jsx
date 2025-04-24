import { Accordion, AccordionItem, Avatar } from "@heroui/react";
import { CardImage } from "./ui/card";

export default function CategoryGrid({ categories }) {
  return (
    <div className="grid bg-gray-100 rounded-lg grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {categories.map((item) => (
        <Accordion key={item.category_id} selectionMode="multiple">
          <AccordionItem
            key={item.category_id}
            aria-label={item.name}
            indicator={<span className="hidden" />}
            title={
              <div className="flex flex-col items-center text-center">
                <img
                  isBordered
                  crossOrigin="anonymous"
                  radius="lg"
                  color="black"
                  src={process.env.NEXT_PUBLIC_API_ENDPOINT + item.icon_url}
                  className="mb-2 w-16 h-16 object-cover rounded-full"
                />
                <h3 className="text-md font-medium">{item.name}</h3>
              </div>
            }
          >
            {item.SubCategories.length > 0 ? (
              <ul className="text-sm text-gray-700 space-y-1 mt-2">
                {item.SubCategories.map((sub) => (
                  <li
                    key={sub.sub_category_id}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    {sub.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic mt-2">
                No subcategories available
              </p>
            )}
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
}
