export class DateToolsService {
  static formatDateToDateString(date: Date): string {
    console.log(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;
  }
  static getPreviousMonthDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month - 1, day);
  }
}
