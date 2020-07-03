import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Ponto } from './ponto';
import { PontoId } from './ponto-id';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private documentCollection: AngularFirestoreCollection<Ponto>;
  document: Observable<PontoId[]>;

  first: string;
  firstPoint: number;
  isOpen = false;

  constructor(private afs: AngularFirestore,
              private swUpdate: SwUpdate,
              private swPush: SwPush,
              private authService: AuthService) {

    swUpdate.available.subscribe(() => {
      if (confirm('New version available. Load new version?')) {
        window.location.reload();
      }
    });

    this.documentCollection = afs.collection<Ponto>('pontos', ref => ref.orderBy('point', 'desc'));

    this.document = this.documentCollection.snapshotChanges().pipe(
      map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Ponto;
            const id = a.payload.doc.id;
            this.first = (a.payload.newIndex === 0) ? data.name : this.first;
            this.firstPoint = (a.payload.newIndex === 0) ? data.point : this.firstPoint;

            if (this.firstPoint === data.point) {
              if (this.first.indexOf(data.name) === -1) {
                this.first = `${this.first} e ${data.name}`;
              }
            }

            return {id, ...data};
          });
        }
      )
    );
  }

  plus = (data: any): void => {
    data.point++;
    this.update(data);
  }

  minus = (data: any): void => {
    if (data.point >= 0) {
      data.point--;
    }

    this.update(data);
  }

  update = (data: any): void => {
    this.afs
    .collection('pontos')
    .doc(data.id)
    .update(data);
  }

  hasAutenticated = () => {
    return this.authService.authFire.user;
  }

  toggle = () => {
    this.isOpen = !this.isOpen;
  }
}
