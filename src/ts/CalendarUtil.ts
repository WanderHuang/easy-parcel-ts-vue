export class CalendarUtil {
  public static weeks = {
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    zh: ['日', '一', '二', '三', '四', '五', '六']
  };

  public static getTheme(index: number): {} {
    return [
      {
        selected: '#808080',
        start: '#555555',
        end: '#2b2b2b'
      }
    ][index];
  }

  public static getWeeks(lang: string): [] {
    return this.weeks[lang];
  }

  public static getDays(date: Date | null): number[][] {
    date = date || new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const weekday = date.getDay();
    const monthFirstWeekday = this.getWeekday(`${year}-${month + 1}-${1}`);
    let lastDay = 0;
    if (year % 4 === 0 && month === 1) {
      lastDay = 29;
    } else {
      lastDay = this.monthDays[month];
    }
    const monthLastWeekday = this.getWeekday(`${year}-${month + 1}-${lastDay}`);

    // 5 * 7
    const days: number[][] = [];
    let current = 1;
    let pivot = 1;
    for (let i = 0; i < 5; i++) {
      const row: number[] = [];
      for (let j = 0; j < 7; j++) {
        if (pivot < monthFirstWeekday + 1) {
          row.push(0);
        } else if (pivot > 35 - (7 - (monthLastWeekday + 1))) {
          row.push(0);
        } else {
          row.push(current++);
        }
        pivot++;
      }
      days.push(row);
    }

    return days;
  }

  public static getMonthMaxDay(year: number, month: number): number {
    if (year % 4 === 0 && month === 1) {
      return 29;
    } else {
      return this.monthDays[month];
    }
  }

  private static monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  private static getWeekday(day: string) {
    return new Date(day).getDay();
  }
}
