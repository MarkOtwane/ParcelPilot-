getMyPayments(): Promise<any[]> {
  return this.http.get<any[]>(`${API}/payments/my`).toPromise();
}
getMyPayments(): Promise<any[]> {
  return this.http.get<any[]>('http://localhost:3000/payments/my').toPromise();
}
getAllPayments(): Promise<any[]> {
  return this.http.get<any[]>('http://localhost:3000/payments').toPromise();
}

