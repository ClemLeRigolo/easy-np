context("Test to check if the admin is connected", () => {
  it('Adds document to test_hello_world collection of Realtime Database', () => {
    cy.callRtdb('set', 'test_hello_world', { some: 'value' });
    cy.callRtdb('get', 'test_hello_world').then((doc) => {
      expect(doc.some).to.eq('value');
    });
    cy.callRtdb('delete', 'test_hello_world');
  });
})
