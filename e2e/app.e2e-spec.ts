import { Angular2WebsocketExperimentPage } from './app.po';

describe('angular2-websocket-experiment App', function() {
  let page: Angular2WebsocketExperimentPage;

  beforeEach(() => {
    page = new Angular2WebsocketExperimentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
