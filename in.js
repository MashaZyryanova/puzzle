// properties and initial velocity
const defaultProps = {
    bounce: 0.15,
}
  
 class Ball {
    constructor (x = 0, y = 0, sceneProps, props) {
      this.props = {
        ...defaultProps,
        startVelX: (Math.random() * 2 + 5) * (Math.floor(Math.random() * 2) || -1),
        startVelY: (Math.random() * 2 + 5) * (Math.floor(Math.random() * 2) || -1),
        radius:Math.random() * 20 + 1,
        ...props
      }
      this.sceneProps = sceneProps
  
      this.x = x
      this.y = y
      this.velX = this.props.startVelX
      this.velY = this.props.startVelY
    }
  
    draw (ctx) {
        const { x, y, props } = this

        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = props.color
        ctx.arc(x, y,props.radius,0, Math.PI * 2
        )
        ctx.fill()
        ctx.restore()
    }
  
    update () {
        const { props, sceneProps } = this

        // bottom bound / floor
        if (this.y + props.radius >= sceneProps.height) {
          this.velY *= -props.bounce
          this.y = sceneProps.height - props.radius
          this.velX *= sceneProps.friction
        }
        // top bound / ceiling
        if (this.y - props.radius <= 0) {
          this.velY *= -props.bounce
          this.y = props.radius
          this.velX *= sceneProps.friction
        }
      
        // left bound
        if (this.x - props.radius <= 0) {
          this.velX *= -props.bounce
          this.x = props.radius
        }
        // right bound
        if (this.x + props.radius >= sceneProps.width) {
          this.velX *= -props.bounce
          this.x = sceneProps.width - props.radius
        }
      
        // reset insignificant amounts to 0
        if (this.velX < 0.01 && this.velX > -0.01) {
          this.velX = 0
        }
        if (this.velY < 0.01 && this.velY > -0.01) {
          this.velY = 0
        }
      
        // update position
        this.velY += sceneProps.gravity
        this.x += this.velX
        this.y += this.velY
    }
}

const defaultConfig = {
    // width = window.innerWidth,
    //  height = window.innerHeight,
     width: 1920,
     height: 900,
    gravity: 0.05,
     friction: 0.08
    
  }

 class Scene {
    constructor (canvasId = 'gameCanvas', config) {
      this.canvas = document.getElementById(canvasId)
      this.ctx = this.canvas.getContext('2d')
      this.config = {
        ...defaultConfig,
        ...config
      }
  
      this.canvas.width = this.config.width
      this.canvas.height = this.config.height
  
      this.createBalls()
  
      document.addEventListener('DOMContentLoaded', () => this.update())
    }
  
  

    createBalls () {
        const { config } = this
        const colors = [ '#05386B','#046975', '#2EA1D4','#FFDF59','#FF1D47','#5CDB95']
        // build an array of ball objects
        const balls = []
    
        for (let i = 0; i < 80; i++) {
          balls.push(
            new Ball(
              // random X Y position
              Math.random() * config.width, Math.random() * config.height,
              // scene config
              {
                // default width, height, friction
                ...config,
                // random positive or negative gravity
                gravity: config.gravity * (Math.floor(Math.random() * 2) || -1)
              },
              // ball properties
              {
                // extra bouncey
                bounce: 0.90,
                // size 10-30
                radius: Math.random() * 20 + 10,
                // random color
                color: colors[Math.floor(Math.random() * colors.length)]
              }
            )
          )
        }
    
        this.balls = balls
      }
    
  
    update () {
      // destructure the scene's variables
      const { ctx, config, balls } = this
  
      // queue the next update
      window.requestAnimationFrame(() => this.update())
  
      // clear the canvas
      ctx.clearRect(0, 0, config.width, config.height)
  
      // update objects
      balls.forEach(ball => ball.update())
  
      // draw objects
      balls.forEach(ball => ball.draw(ctx))
    }
  }
  
  const animation = new Scene()