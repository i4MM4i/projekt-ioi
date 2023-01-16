import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  server = "http://127.0.0.1:5000"

  constructor(private http: HttpClient) {}

  HttpUploadOptions = {
    headers: new HttpHeaders({ "Content-Type": "multipart/form-data"})
  }



  generateFutureImage(image_file: File, prompt: string): Observable<any> {
    const newData = new FormData();
    newData.append('image_file', image_file);
    newData.append('prompt', prompt);
    return this.http.post<any>(this.server + '/upload', newData);
  }
}
