export type DateRangeType =
   | "today"
   | "week"
   | "month"
   | "year"
   | "all";

export const getDateRange = (range: DateRangeType) => {

   if (range === "all") {
      return { start: null, end: null };
   }
   const now = new Date();
   let start = new Date(now);
   let end = new Date(now);

   switch (range) {
      case "today":
         start.setHours(0, 0, 0, 0);
         end.setHours(23, 59, 59, 999);
         break;

      case "week": {
         const day = now.getDay();
         const diff = now.getDate() - day + (day === 0 ? -6 : 1);
         start = new Date(now.setDate(diff));
         start.setHours(0, 0, 0, 0);
         end = new Date(start);
         end.setDate(start.getDate() + 6);
         end.setHours(23, 59, 59, 999);
         break;
      }

      case "month":
         start = new Date(now.getFullYear(), now.getMonth(), 1);
         end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
         break;

      case "year":
         start = new Date(now.getFullYear(), 0, 1);
         end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
         break;
   }

   return { start, end };
};