export default () => ({
  app: {
    port: parseInt(process.env.LISTENER_PORT!, 10),
  },
});
