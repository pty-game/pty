import io from 'socket.io-client';


describe('socket', () => {
  it('connect', () => {
    try {
      const client = io('http://localhost:3001');

      client.on('connected', (data) => {
        expect(data.hello).toBe('world');
      });
    } catch (err) {
      throw new Error(err);
    }
  });
});
