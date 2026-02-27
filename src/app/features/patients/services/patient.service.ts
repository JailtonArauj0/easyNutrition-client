import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Patient } from '../models/patient';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/users';

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/all`)
  }
}
