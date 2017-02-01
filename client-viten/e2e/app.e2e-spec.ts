import { ClientVitenPage } from './app.po';

describe('client-viten App', function() {
  let page: ClientVitenPage;

  beforeEach(() => {
    page = new ClientVitenPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
