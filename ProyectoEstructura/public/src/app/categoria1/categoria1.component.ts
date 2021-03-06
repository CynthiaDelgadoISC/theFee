import { PostServiceService } from "./../services/post-service.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, NgZone, OnDestroy } from "@angular/core";
import swal from "sweetalert2";
//lector
import Speech from "speak-tts"; //importamos la librería
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: "app-categoria1",
  templateUrl: "./categoria1.component.html",
  styleUrls: ["./categoria1.component.css"],
})
export class Categoria1Component implements OnDestroy {
  idCategoria: string;
  mensaje: string;
  lecFinal = ""; //variable en donde guardaremos lo que se va a leer al final
  speech: any;
  user: any;
  nombre: string;
  posts: [] = [];
  descripcion = '';
  fileData: any;
  previewUrl: any = null;
  modalLoading = false;
  stop$: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private ngZone: NgZone,
    private postService: PostServiceService
  ) {
    this.stop$ = new Subject<void>();
    this.afAuth.onAuthStateChanged((user) => {
      this.ngZone.run(() => {
        if (!user) {
          this.router.navigate(["theFee"]);
        } else {
          this.route.params.subscribe((params) => {
            this.idCategoria = params.id;
          });
          this.user = user;
          console.log(user)
          this.reloadPosts();
        }
      });
    });
    // lector de pantalla

    this.speech = new Speech(); //Ve si es soportado en nuestro navegador

    if (this.speech.hasBrowserSupport()) {
      //si es soportado en nuestro navegador entra
      //console.log("speech synthesis supported");
      //inicializamos nuestro speech
      this.speech
        .init({
          volume: 1,
          lang: "es-MX",
          rate: 1,
          pitch: 1,
          voice: "Google UK English Male",
          splitSentences: true,
          listeners: {
            onvoiceschanged: (voices) => {
              //console.log("Event voiceschanged", voices);
            },
          },
        })
        .then((data) => {
          //data contiene una lista de voces
          //console.log("Speech está listo", data);
          data.voices.forEach((voice) => {
            //console.log(voice.name + " " + voice.lang);
          });
        })
        .catch((e) => {
          console.error("Ocurrió un error al iniciar Speech: ", e);
        });
    } //fin if
  }
/*
  addPost() {
    let fecha = new Date();
    // tslint:disable-next-line: max-line-length
    this.postService
      .addPost(
        this.user.uid,
        this.user.displayName,
        this.mensaje,
        this.idCategoria,
        fecha.toDateString()
      )
      .subscribe((data: any) => {
        if (data.succed) {
          swal.fire({
            title: "Sweet!",
            text: "Modal with a custom image.",
            imageUrl:
              "https://i.pinimg.com/originals/e1/f2/3d/e1f23dfb401e68caf9e0d81e469a2b46.gif",
            imageWidth: 400,
            imageHeight: 200,
            imageAlt: "Custom image",
          });
          this.mensaje = "";
          this.reloadPosts();
        } else if (data.succed == false) {
          console.log(data);
        }
      });
  }
*/
addPost() {
  this.modalLoading = true;
  let fecha = new Date();
  this.postService.sendPost(this.user, this.fileData, this.descripcion, this.idCategoria, fecha.toDateString(), this.user.photoURL);
  this.postService._subirPost.pipe(takeUntil(this.stop$)).subscribe((data: any) => {
    console.log(data);
    if (data && data.success) {
      if (data.status === 'escrito en base de datos'){
        swal.fire({
          title: 'Listo!',
          text: 'Se ha subido correctamente!',
          icon: 'success'
        });
        this.reloadPosts()
      }
      this.modalLoading = false;
    }
  });
}
  // botones de lector
  play() {
    var textoLeer = document.createElement("div"); //guardamos lo que queremos que lea en la sig variable
    //guardamos lo que queremos que lea en la sig variable
    textoLeer.innerHTML = document.getElementById("esto").innerHTML;

    this.lecFinal = textoLeer.textContent || textoLeer.innerText || ""; //guardamos la posibilidad de lectura en la variable lecFinal

    this.speech
      .speak({
        text: this.lecFinal, //aqui es donde se realiza la lectura
      })
      .then(() => {
        console.log("Exito");
      })
      .catch((e) => {
        console.error("Ocurrió un error: ", e);
      });
  }

  pausa() {
    this.speech.pause();
  }

  continua() {
    this.speech.resume();
  }

  goToUser(id, autor) {
    this.router.navigateByUrl("/usuario/" + id + "/" + autor);
  }
  reloadPosts(){
    this.postService.getPosts(this.idCategoria).subscribe((data: any) => {
      this.posts = data.posts;
      console.log(data.posts)
    });
  }
  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
  fileProgress(fileInput: any) {
    this.fileData = (fileInput.target.files[0] as File);
    // Show preview
    let mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    let reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (_event) => {
      this.previewUrl = reader.result;
    };
  }
}
