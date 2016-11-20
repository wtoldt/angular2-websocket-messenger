import { Component, OnInit, ElementRef, AfterViewChecked } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import * as SockJs from 'sockjs-client';

import * as env from '../environments/environment';

var Stomp = require('stompjs');

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewChecked {
	messages: { 'name': string, 'text': string }[] = [];
	stompClient: any;
	url: string = `${env.environment.baseUrl}/websocket`;
	topicUrl = '/messages';
	el: HTMLElement;
	messagesEl: HTMLElement;
	pageHeight$: Subject<any> = new Subject<any>();


	constructor(element: ElementRef) {
		let message = {
			name: 'welcome',
			text: 'try typing in the text box thats in the footer'
		};
		this.messages.push(message);

		this.el = element.nativeElement;
		this.pageHeight$
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe( value => {
				this.messagesEl.style.maxHeight = `${value}px`;
				this.messagesEl.lastElementChild.scrollIntoView();
			});
	}

	ngOnInit() {
		let socket = new SockJs(this.url);
		this.stompClient = Stomp.over(socket);

		this.stompClient.connect({}, frame => {
			this.stompClient.subscribe(this.topicUrl, response => {
				let message = JSON.parse(response.body);

				this.messages.push({
					'name': message.name,
					'text': message.text
				});
				setTimeout( () => {
					this.messagesEl.lastElementChild.scrollIntoView();
				}, 123);
			},
			error => {
				console.log('error', error);
			});
		});

		this.messagesEl = <HTMLElement>this.el.querySelector("#messages");
	}
	ngAfterViewChecked() {
		let mainHeight = this.el.querySelector("main").clientHeight,
			footerHeight = this.el.querySelector("footer").clientHeight,
			messagesHeight = mainHeight - footerHeight - 20;

		this.pageHeight$.next(messagesHeight);
	}

	onSubmit(name, text) {
		this.stompClient.send("/app/messages", {}, JSON.stringify({'name': name.value, 'text': text.value}));
		text.value = '';
	}
}
