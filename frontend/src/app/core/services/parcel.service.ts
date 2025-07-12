getMyParcels(): Promise<{ sent: any[]; received: any[] }> {
  return this.http.get<any>(`${API}/parcels/my`).toPromise();
}
getMyParcels(): Promise<{ sent: any[]; received: any[] }> {
  return this.http.get<any>('http://localhost:3000/parcels/my').toPromise();
}

getAllParcels(): Promise<any[]> {
  return this.http.get<any[]>('http://localhost:3000/parcels').toPromise();
}

updateStatus(parcelId: string, status: string): Promise<any> {
  return this.http.patch('http://localhost:3000/parcels/update-status', {
    parcelId,
    status
  }).toPromise();
}
