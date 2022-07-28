import { setupLogger } from "@lib/logger";

describe('SetupLogger for local env', ()=>{
  beforeAll(()=>{
    process.env.NODE_ENV = 'local';
  });
  it('should use the local logger',()=>{
    const logger = setupLogger({name:'Unitest',id:'FOO',version:'v1'});
    expect(logger).not.toBeUndefined();
  });
});

describe('SetupLogger for local env', ()=>{
  beforeAll(()=>{
    process.env.NODE_ENV = 'dev';
    process.env.GLSA_PROJECT_ID = 'fooId';
    process.env.GLSA_CLIENT_EMAIL = 'bar@foo';
    process.env.GLSA_PRIVATE_KEY = 'bookey';
  });
  it('should use the dev logger',()=>{
    const logger = setupLogger({name:'Unitest',id:'Bar',version:'v1'},{
      projectId: process.env.GLSA_PROJECT_ID!,
      clientEmail:process.env.GLSA_CLIENT_EMAIL!,
      privateKey:process.env.GLSA_PRIVATE_KEY!
    });
    expect(logger).not.toBeUndefined();
  });
});