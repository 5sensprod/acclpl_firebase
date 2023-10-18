import React from 'react'

export default function SignUpModal() {
  return (
    <div className="position-fixed top-0 vw-100 vh-100">
      <div className="w-100 h-100 bg-dark bg-opacity-75">
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{ minWidth: '400px' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">S'inscrire</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Fermer"
                ></button>
              </div>
              <div className="modal-body">
                <form className="sign-up-form">
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Adresse e-mail
                    </label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      id="signUpEmail"
                      placeholder="nom@exemple.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="signUpPwd" className="form-label">
                      Mot de passe
                    </label>
                    <input
                      name="pwd"
                      type="pwd"
                      required
                      className="form-control"
                      id="signUpPwd"
                      placeholder="Mot de passe"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="repeatPwd" className="form-label">
                      Confirmez le mot de passe
                    </label>
                    <input
                      name="pwd"
                      required
                      type="password"
                      className="form-control"
                      id="repeatPwd"
                      placeholder="Confirmez le mot de passe"
                    />
                    <p className="text-danger mt-1"></p>
                  </div>
                  <button type="submit" className="btn btn-primary">
                    S'inscrire
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
