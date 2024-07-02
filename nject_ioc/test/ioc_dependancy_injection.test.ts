import { contextRegistry } from "../core/context_registry";
import { Component } from "../decorators/component_decorator";
import { IOCContext } from "../decorators/context_decorator";
import { Inject } from "../decorators/inject_decorator";

@IOCContext()
class Contenxt {}

@Component()
class A {
  public h() {
    console.log("A");
  }
}

@Component()
class C {
  constructor(@Inject(A) private a: A) {}
  public h() {
    this.a.h();
    console.log("C");
  }
}

@Component()
class B {
  constructor(@Inject(A) private a: A) {}
  public h() {
    this.a.h();
    console.log("B");
  }
}

@Component()
class BC {
  constructor(@Inject(B) private b: B, @Inject(C) private c: C) {
    b.h();
    c.h();
  }
}

contextRegistry.getDefaultContext().build();

