// src/types.ts

export interface CalendarEvent {
    startDate: Date;
    endDate: Date;
    title: string;
}

export interface Plan {
    start: string;
    end: string;
    title: string;
    color: string;
}
