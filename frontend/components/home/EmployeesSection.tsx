import { EmployeePreview } from "@/types/employee/EmployeePreview";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "../ui/item";
import { Badge } from "../ui/badge";

async function EmployeesSection() {
  const response = await fetch(`${process.env.API_URL}/employee/preview`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return (
      <p className="col-span-5 text-center font-bold">
        Failed to parse employees
      </p>
    );
  }

  const data: EmployeePreview[] = await response.json();

  if (data.length === 0) {
    return (
      <p className="col-span-5 text-center font-bold">No employees found...</p>
    );
  }

  return (
    <div className="md:col-span-1 flex flex-col gap-4">
      <p className="uppercase">Our team</p>

      <div className="flex flex-col gap-2">
        {data.map((employee, i) => {
          const treatments = employee.treatmentsPreview.treatments;
          const treatmentsCount = employee.treatmentsPreview.totalCount;
          const notListedCount = treatmentsCount - treatments.length;
          return (
            <Item key={i} className="bg-card">
              <ItemContent>
                <ItemTitle className="text-lg">
                  {employee.firstName} {employee.lastName}
                </ItemTitle>
                <ItemDescription className="flex flex-wrap items-center gap-1">
                  {treatments.map((treatment, j) => (
                    <Badge key={j}>{treatment}</Badge>
                  ))}

                  {notListedCount > 0 && <span>+{notListedCount}</span>}
                </ItemDescription>
                <ItemFooter className="opacity-75 text-xs">
                  {employee.position}
                </ItemFooter>
              </ItemContent>
            </Item>
          );
        })}
      </div>
    </div>
  );
}

export default EmployeesSection;
