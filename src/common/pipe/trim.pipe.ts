import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class TrimPipe implements PipeTransform {
    transform(val: string) {
        return val.trim();
    }
}